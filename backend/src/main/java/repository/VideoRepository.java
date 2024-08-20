package repository;

import dtos.*;
import enums.VisibilityEnum;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import model.Question;
import model.Tag;
import model.Video;
import model.VideoFile;
import model.*;
import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;
import net.bramp.ffmpeg.probe.FFmpegProbeResult;
import net.bramp.ffmpeg.probe.FFmpegStream;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.apache.commons.io.FileUtils;

@Transactional
@ApplicationScoped
public class VideoRepository {
    @Inject
    EntityManager em;

    public Video create(CreateVideoDTO video) {
        System.out.println(video.toString());

        Video newVideo = new Video(video.title(), video.description(), video.visibility());
        for (Integer tagId : video.tags()) {
            Tag tag = em.find(Tag.class, tagId.longValue());
            newVideo.addTag(tag);
        }
        newVideo.setQuestions(video.questions());
        newVideo.setColor(video.color());
        em.persist(newVideo);

        return newVideo;
    }

    public VideoDetailDTO update(EditVideoDTO video) {
        Video videoToUpdate = em.find(Video.class, video.contentId());

        videoToUpdate.setTitle(video.title());
        videoToUpdate.setDescription(video.description());
        videoToUpdate.setTags(video.tags());
        videoToUpdate.setQuestions(video.questions());
        videoToUpdate.setVisibility(video.visibility());
        videoToUpdate.setColor(video.color());

        for (Question question : video.questions()) {
            try{
                em.merge(question);
            }catch (Exception e) {
                em.persist(new Question(question.getText()));
            }

        }

        em.merge(videoToUpdate);

        return videoToUpdate.toVideoDetailDTO();
    }

    public void delete(Long id) {
        em.remove(getById(id));
    }

    public Video getById(Long id){
        System.out.println("getById " + id);
        return em.find(Video.class, id);
    }

    public VideoDetailDTO getVideoDetailsForUser(Long videoId, Long userId) {
        System.out.println("getVideoDetails user: " + userId + " video: " + videoId);

        Video video = em.find(Video.class, videoId);

        if(video == null) {
            return null;
        }

        int viewProgressDuration;
        try {
            viewProgressDuration = em.createQuery(
                            "select vp.progress from ViewProgress vp " +
                                    "where vp.user.userId = :userId " +
                                    "and vp.content.contentId = :videoId", Integer.class)
                    .setParameter("userId", userId)
                    .setParameter("videoId", videoId)
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (NoResultException e) {
            viewProgressDuration = 0;
        }

        return new VideoDetailDTO(
            video.getContentId(),
            video.getTitle(),
            video.getDescription(),
            video.getColor(),
            video.getTags(),
            video.getComments(userId),
            video.getQuestions(),
            video.calculateStarRating(),
            video.getVideoFile(),
            viewProgressDuration,
            video.getVisibility()
        );
    }

    /**
     * Links a given videoFile(identifies the actual file and stores metadata) to a Video(stores description, title, tags, comments etc.)
     * This is necessary because the upload process should not be dependent on a specific video in case the upload gets cancelled or simmilar.
     * Also, because the videoFile is created before the video itself.
     *
     * @param videoId
     * @param fileId
     */
    public void linkVideoFile(Long videoId, Long fileId) {
        Video video = em.find(Video.class, videoId);
        VideoFile videoFile = em.find(VideoFile.class, fileId);
        video.setVideoFile(videoFile);
    }

    public void updateVideoVisibility(Long videoId, VisibilityEnum v) {
        Video video = em.find(Video.class, videoId);
        video.setVisibility(v);
    }

    @Transactional
    public void finishQuiz(Long videoId, Long userId, int score, List<AnswerOption> questionResults) {
        try{
            QuizResult quizResult = em.createQuery("select qr from QuizResult qr where qr.video.contentId = :videoId and qr.user.userId = :userId", QuizResult.class)
                    .setParameter("videoId", videoId)
                    .setParameter("userId", userId)
                    .getSingleResult();

            if(quizResult.getScore() < score){
                System.out.println("better score");
                quizResult.setScore(score);
                quizResult.setQuestionResults(questionResults);
                quizResult.setTimestamp(System.currentTimeMillis());
                em.merge(quizResult);
            }

        }catch (NoResultException e){
            QuizResult quizResult = new QuizResult(em.find(Video.class, videoId), em.find(User.class, userId), score);
            quizResult.setQuestionResults(questionResults);
            em.persist(quizResult);
        }
    }

    public QuizResultDTO getQuizResults(Long videoId, Long userId) {
        try{
            QuizResult result = em.createQuery("select qr from QuizResult qr where qr.video.contentId = :videoId and qr.user.userId = :userId", QuizResult.class)
                    .setParameter("videoId", videoId)
                    .setParameter("userId", userId)
                    .getSingleResult();
            return new QuizResultDTO(result.getQuizResultId(), result.getQuestionResults(), result.getScore());
        } catch (NoResultException e){
            return null;
        }
    }
}
