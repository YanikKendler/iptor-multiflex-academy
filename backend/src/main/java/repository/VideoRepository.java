package repository;

import dtos.CreateVideoDTO;
import dtos.EditVideoDTO;
import dtos.VideoDetailDTO;
import dtos.VideoOverviewDTO;
import enums.VisibilityEnum;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import model.Tag;
import model.Video;
import model.VideoFile;
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
        try{
            videoToUpdate.setVideoFile(em.find(VideoFile.class, video.videoFile().getVideoFileId()));
        }
        catch (NullPointerException ignored){ };


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

        int viewProgressDuration;
        try {
            viewProgressDuration = em.createQuery(
                            "select vp.durationSeconds from ViewProgress vp " +
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
}
