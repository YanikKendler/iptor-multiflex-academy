package repository;

import dtos.*;
import enums.ContentEditType;
import enums.ContentNotificationEnum;
import enums.UserRoleEnum;
import enums.VisibilityEnum;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import model.Question;
import model.Video;
import model.VideoFile;
import model.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Transactional
@ApplicationScoped
public class VideoRepository {
    @Inject
    EntityManager em;

    @Inject
    LearningPathRepository learningPathRepository;
    @Inject
    UserRepository userRepository;

    public Video create(CreateVideoDTO createVideoDTO, Long userId) {
        List<Question> questions = new LinkedList<>();

        for (Question question : createVideoDTO.questions()) {
            List<AnswerOption> answerOptions = new LinkedList<>();

            for(AnswerOption answerOption : question.getAnswerOptions()){
                AnswerOption newAnswerOption = new AnswerOption(answerOption.getText(), answerOption.isCorrect());
                em.persist(newAnswerOption);
                answerOptions.add(newAnswerOption);
            }

            Question newQuestion = new Question(question.getText(), answerOptions);
            em.persist(newQuestion);
            questions.add(newQuestion);
        }

        String title = createVideoDTO.title();
        if(title == null || title.isEmpty()){
            title = "Untitled Video";
        }

        Video newVideo = new Video(
                title,
                createVideoDTO.description(),
                createVideoDTO.visibility(),
                createVideoDTO.color(),
                createVideoDTO.tags(),
                questions,
                createVideoDTO.videoFile(),
                em.find(User.class, userId)
        );

        boolean isUserAdmin = userRepository.getById(userId).getUserRole().equals(UserRoleEnum.ADMIN);
        newVideo.setApproved(isUserAdmin);
        em.persist(newVideo);

        if(!isUserAdmin){
            User admin = em.createQuery("select u from User u where u.userRole = 'ADMIN'", User.class).getSingleResult();
            em.persist(new ContentNotification(admin, newVideo.getUser(), newVideo, ContentNotificationEnum.videoCreateRequest));
        }

        return newVideo;
    }

    public VideoDetailDTO update(EditVideoDTO video, Long userId) {
        Video videoToUpdate = em.find(Video.class, video.contentId());

        if(!Objects.equals(videoToUpdate.getTitle(), video.title())){
            videoToUpdate.setTitle(video.title());
            em.persist(new ContentEditHistory(userRepository.getById(userId), videoToUpdate, ContentEditType.title));
        }

        if(!Objects.equals(videoToUpdate.getDescription(), video.description())){
            videoToUpdate.setDescription(video.description());
            em.persist(new ContentEditHistory(userRepository.getById(userId), videoToUpdate, ContentEditType.description));
        }

        if(!Objects.equals(videoToUpdate.getColor(), video.color())){
            videoToUpdate.setColor(video.color());
            em.persist(new ContentEditHistory(userRepository.getById(userId), videoToUpdate, ContentEditType.color));
        }

        Set<Long> tagOne = video.tags().stream().map(Tag::getTagId).collect(Collectors.toSet());
        Set<Long> tagTwo = videoToUpdate.getTags().stream().map(Tag::getTagId).collect(Collectors.toSet());
        if(!tagOne.equals(tagTwo)){
            videoToUpdate.setTags(video.tags());
            em.persist(new ContentEditHistory(userRepository.getById(userId), videoToUpdate, ContentEditType.tags));
        }

        Set<Long> questionOne = video.questions().stream().map(Question::getQuestionId).collect(Collectors.toSet());
        Set<Long> questionTwo = videoToUpdate.getQuestions().stream().map(Question::getQuestionId).collect(Collectors.toSet());
        if(!questionOne.equals(questionTwo)){
            em.createQuery("delete from QuizResult q where q.video.contentId = :videoId")
                    .setParameter("videoId", video.contentId())
                    .executeUpdate();
            videoToUpdate.setQuestions(video.questions());

            for (Question question : video.questions()) {
                try{
                    em.merge(question);
                }catch (Exception e) {
                    em.persist(new Question(question.getText()));
                }
            }
            em.persist(new ContentEditHistory(userRepository.getById(userId), videoToUpdate, ContentEditType.questions));
        }

        if(video.visibility() != videoToUpdate.getVisibility()){
            videoToUpdate.setVisibility(video.visibility());
            em.persist(new ContentEditHistory(userRepository.getById(userId), videoToUpdate, ContentEditType.visibility));
        }

        em.merge(videoToUpdate);
        alertRelevantUsers(videoToUpdate);

        return videoToUpdate.toVideoDetailDTO();
    }

    public void alertRelevantUsers(Video video){
        List<User> savedUsers = em.createQuery("select distinct u from User u " +
                        "join u.savedContent us on us.contentId = :contentId", User.class)
                .setParameter("contentId", video.getContentId())
                .getResultList();

        List<User> assignedUsers = em.createQuery("select distinct u from User u " +
                        "join ContentAssignment ca on ca.content.contentId = :contentId and ca.assignedTo.userId = u.userId" +
                        " where ca.isFinished = false", User.class)
                .setParameter("contentId", video.getContentId())
                .getResultList();
        Set<User> allUsers = new HashSet<>(savedUsers);
        allUsers.addAll(assignedUsers);

        allUsers.forEach(user -> {
            if(Objects.equals(video.getUser().getUserId(), user.getUserId())){
                return;
            }
            em.persist(new ContentNotification(user, video.getUser(), video, ContentNotificationEnum.update));
        });
    }

    public void delete(Long id) {
        try{
            List<ContentAssignment> ca = em.createQuery("select ca from ContentAssignment ca where ca.content.contentId = :contentId", ContentAssignment.class)
                    .setParameter("contentId", id).getResultList();

            ca.forEach(c -> {
                c.setContent(null);
                em.remove(c);
            });
        } catch(NoResultException e){}

        try{
            List<LearningPath> lp = em.createQuery("select lp from LearningPath lp join lp.entries e where e.video.contentId = :videoId", LearningPath.class)
                    .setParameter("videoId", id).getResultList();

            lp.forEach(l -> {
                l.setEntries(l.getEntries().stream().filter(e -> !Objects.equals(e.getVideo().getContentId(), id)).toList());
                learningPathRepository.alertRelevantUsers(l);
            });
        } catch(NoResultException e){}

        em.createQuery("delete from LearningPathEntry e where e.video.contentId = :videoId")
                .setParameter("videoId", id)
                .executeUpdate();

        em.createQuery("delete from ViewProgress vp where vp.content.contentId = :videoId")
                .setParameter("videoId", id)
                .executeUpdate();

        em.createQuery("delete from QuizResult q where q.video.contentId = :videoId")
                .setParameter("videoId", id)
                .executeUpdate();

        getById(id).getAllComments().forEach(comment -> {
            em.createQuery("delete from CommentNotification n where n.comment.commentId = :commentId or n.video.contentId = :contentId")
                    .setParameter("commentId", comment.getCommentId())
                    .setParameter("contentId", id)
                    .executeUpdate();
            em.remove(comment);
        });

        em.createQuery("delete from ContentNotification n where n.content.contentId = :contentId")
                .setParameter("contentId", id)
                .executeUpdate();

        em.createQuery("delete from ContentEditHistory h where h.content.contentId = :contentId")
                .setParameter("contentId", id)
                .executeUpdate();

        VideoFile file = getById(id).getVideoFile();

        userRepository.getById(getById(id).getUser().getUserId()).getSavedContent().remove(getById(id));

        em.remove(getById(id));

        if(file != null){
            em.remove(file);
        }
    }

    public Video getById(Long id){
        return em.find(Video.class, id);
    }

    public List<VideoOverviewDTO> getAllAsOverviewDTO() {
        return em.createQuery(
                "select v from Video v " +
                        "where v.visibility != 'self'"
                , Video.class)
                .getResultStream()
                .map(video -> {
                    Long duration = 0L;
                    try{
                        duration = video.getVideoFile().getDurationSeconds();
                    } catch (NullPointerException ignored){ }
                    return new VideoOverviewDTO(
                            video.getContentId(),
                            video.getTitle(),
                            video.getDescription(),
                            video.getTags(),
                            false,
                            video.getColor(),
                            duration,
                            video.getQuestions().size(),
                            null
                    );
                }).toList();
    }

    public VideoDetailDTO getVideoDetailsForUser(Long videoId, Long userId) {
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
            video.getVisibility(),
            video.getUser().getUserId(),
            video.isApproved()
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

    public void updateVideoVisibility(Long videoId, Long userId, VisibilityEnum v) {
        Video video = em.find(Video.class, videoId);
        video.setVisibility(v);
        em.persist(new ContentEditHistory(userRepository.getById(userId), video, ContentEditType.visibility));
    }

    @Transactional
    public void finishQuiz(Long videoId, Long userId, int score, List<AnswerOption> questionResults) {
        try{
            QuizResult quizResult = em.createQuery("select qr from QuizResult qr where qr.video.contentId = :videoId and qr.user.userId = :userId", QuizResult.class)
                    .setParameter("videoId", videoId)
                    .setParameter("userId", userId)
                    .getSingleResult();

            if(quizResult.getScore() < score){
                quizResult.setScore(score);
                quizResult.setQuestionResults(questionResults);
                quizResult.setTimestamp(LocalDateTime.now());
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
