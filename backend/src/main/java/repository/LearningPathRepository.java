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
import model.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.LinkedList;
import java.util.List;
import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
@Transactional
public class LearningPathRepository {
    @Inject
    EntityManager em;
    @Inject
    UserRepository userRepository;
    @Inject
    NotificationRepository notificationRepository;

    public LearningPathDetailDTO getDetailDTO(Long pathId, Long userId){
        LearningPath learningPath = em.find(LearningPath.class, pathId);

        if(learningPath == null){
            return null;
        }

        ViewProgress viewProgress;

        try{
            viewProgress = em.createQuery("select vp from ViewProgress vp where vp.content.contentId = :contentId and vp.user.userId = :userId", ViewProgress.class)
                    .setParameter("contentId", pathId).setParameter("userId", userId).setMaxResults(1).getSingleResult();
        } catch (Exception e) {
            viewProgress = null;
        }

        return new LearningPathDetailDTO(
            learningPath.getContentId(),
            learningPath.getTitle(),
            learningPath.getDescription(),
            learningPath.getTags(),
            viewProgress,
            learningPath.getVisibility(),
            learningPath.getColor(),
            learningPath.getEntries().stream().map(entry -> {
                Long duration = 0L;
                try{
                        duration = entry.getVideo().getVideoFile().getDurationSeconds();
                }catch (NullPointerException ignored){ }

                QuizResult quizResult;
                LocalDateTime endTime;
                double progress = 0.0;
                try{
                    quizResult = em.createQuery(
                            "select qr from QuizResult qr " +
                            "where qr.video.contentId = :contentId " +
                            "and qr.user.userId = :userId"
                    , QuizResult.class)
                        .setParameter("contentId", entry.getVideo().getContentId())
                        .setParameter("userId", userId)
                        .setMaxResults(1)
                        .getSingleResult();

                    endTime = quizResult.getTimestamp();
                    int totalAnswerOptions = entry.getVideo().getQuestions().stream()
                            .mapToInt(question -> question.getAnswerOptions().size())
                            .sum();

                    progress = (double) quizResult.getScore() / totalAnswerOptions;
                }catch (Exception e){
                    quizResult = null;
                    endTime = LocalDateTime.ofEpochSecond(0, 0, ZoneOffset.UTC);
                }

                ViewProgress videoViewProgress;
                LocalDateTime startTime;
                try {
                    videoViewProgress = em.createQuery(
                            "select vp from ViewProgress vp " +
                            "where vp.content.contentId = :videoId " +
                            "and vp.user.userId = :userId"
                    , ViewProgress.class)
                        .setParameter("videoId", entry.getVideo().getContentId())
                        .setParameter("userId", userId)
                        .setMaxResults(1)
                        .getSingleResult();
                    startTime = videoViewProgress.getTimestamp();
                }catch (Exception e){
                    videoViewProgress = null;
                    startTime = LocalDateTime.ofEpochSecond(0, 0, ZoneOffset.UTC);
                }

                return new LearningPathEntryDTO(
                    entry.getPathEntryId(),
                    entry.getVideo().getContentId(),
                    entry.getVideo().getTitle(),
                    duration,
                    entry.getVideo().getComments(null).size(),
                    entry.getEntryPosition(),
                    startTime,
                    endTime,
                    progress
                );
            }
        ).toList(),
                learningPath.isApproved());
    }

    public LearningPathDetailDTO update(EditLearningPathDTO data, Long userId) {
        System.out.println("UPDATE LEARNINGPATH: " + data.toString());

        LearningPath pathToUpdate = em.find(LearningPath.class, data.contentId());

        if(!Objects.equals(data.title(), pathToUpdate.getTitle())){
            pathToUpdate.setTitle(data.title());
            em.persist(new ContentEditHistory(userRepository.getById(userId), pathToUpdate, ContentEditType.title));
        }

        if(!Objects.equals(data.description(), pathToUpdate.getDescription())){
            pathToUpdate.setDescription(data.description());
            em.persist(new ContentEditHistory(userRepository.getById(userId), pathToUpdate, ContentEditType.description));
        }

        if(data.visibility() != pathToUpdate.getVisibility()){
            pathToUpdate.setVisibility(data.visibility());
            em.persist(new ContentEditHistory(userRepository.getById(userId), pathToUpdate, ContentEditType.visibility));
        }

        Set<Long> tagOne = data.tags().stream().map(Tag::getTagId).collect(Collectors.toSet());
        Set<Long> tagTwo = pathToUpdate.getTags().stream().map(Tag::getTagId).collect(Collectors.toSet());
        if(!tagOne.equals(tagTwo)){
            pathToUpdate.setTags(data.tags());
            em.persist(new ContentEditHistory(userRepository.getById(userId), pathToUpdate, ContentEditType.tags));
        }

        if(!Objects.equals(data.color(), pathToUpdate.getColor())){
            pathToUpdate.setColor(data.color());
            em.persist(new ContentEditHistory(userRepository.getById(userId), pathToUpdate, ContentEditType.color));
        }

        List<LearningPathEntry> entries = new LinkedList<>();

        for (LearningPathEntryDTO entry : data.entries()) {
            LearningPathEntry entryToUpdate;

            try{
                entryToUpdate = em.find(LearningPathEntry.class, entry.pathEntryId());
                entryToUpdate.setEntryPosition(entry.entryPosition());
                em.merge(entryToUpdate);
            }catch (Exception e) {
                entryToUpdate = new LearningPathEntry(
                        em.find(Video.class, entry.videoId()),
                        entry.entryPosition()
                );
                em.persist(entryToUpdate);
            }

            entries.add(entryToUpdate);
        }

        Set<Long> entryOne = data.entries().stream().map(LearningPathEntryDTO::pathEntryId).collect(Collectors.toSet());
        Set<Long> entryTwo = pathToUpdate.getEntries().stream().map(LearningPathEntry::getPathEntryId).collect(Collectors.toSet());
        if(!entryOne.equals(entryTwo)){
            pathToUpdate.setEntries(entries);
            em.persist(new ContentEditHistory(userRepository.getById(userId), pathToUpdate, ContentEditType.entries));
        }

        em.merge(pathToUpdate);

        notifyRelevantUsers(pathToUpdate);

        return null;
    }

    public void notifyRelevantUsers(LearningPath learningPath){
        List<User> savedUsers = em.createQuery("select distinct u from User u " +
                        "join u.savedContent us on us.contentId = :contentId", User.class)
                .setParameter("contentId", learningPath.getContentId())
                .getResultList();

        savedUsers.forEach(user -> {
            if(Objects.equals(learningPath.getUser().getUserId(), user.getUserId())){
                return;
            }

            ContentNotification notification = new ContentNotification(user, learningPath.getUser(), learningPath, ContentNotificationEnum.update);
            em.persist(notification);
            notificationRepository.sendConfirmationEmail(notification);
        });
    }

    public LearningPath create(EditLearningPathDTO data, Long userId) {
        List<LearningPathEntry> entries = new LinkedList<>();

        for (LearningPathEntryDTO entryDTO : data.entries()) {
            LearningPathEntry newEntry = new LearningPathEntry(
                    em.find(Video.class, entryDTO.videoId()),
                    entryDTO.entryPosition()
            );
            em.persist(newEntry);
            entries.add(newEntry);
        }

        String title = data.title();
        if(title == null || title.isEmpty()){
            title = "Untitled Learningpath";
        }

        LearningPath newLearningPath = new LearningPath(
                title,
                data.description(),
                data.visibility(),
                entries,
                data.color(),
                em.find(User.class, userId)
        );

        boolean isUserAdmin = userRepository.getById(userId).getUserRole().equals(UserRoleEnum.ADMIN);
        newLearningPath.setApproved(isUserAdmin);
        em.persist(newLearningPath);

        if(!isUserAdmin){
            User admin = em.createQuery("select u from User u where u.userRole = 'ADMIN'", User.class).getSingleResult();

            ContentNotification notification = new ContentNotification(admin, newLearningPath.getUser(), newLearningPath, ContentNotificationEnum.videoCreateRequest);
            em.persist(notification);
            notificationRepository.sendConfirmationEmail(notification);
        }

        return newLearningPath;
    }

    public void getNext(Long pathId, Long userId) {
        ViewProgress viewProgress;
        try{
            viewProgress = em.createQuery("select vp from ViewProgress vp where vp.content.contentId = :contentId and vp.user.userId = :userId", ViewProgress.class)
                    .setParameter("contentId", pathId).setParameter("userId", userId).setMaxResults(1).getSingleResult();
            viewProgress.setProgress(viewProgress.getProgress() + 1);
            em.merge(viewProgress);
        } catch (Exception e) {
            viewProgress = new ViewProgress(em.find(LearningPath.class, pathId), em.find(User.class, userId), 1);
            em.persist(viewProgress);
        }
    }

    public void updatePathVisibility(Long pathId, Long userId, VisibilityEnum v) {
        LearningPath learningPath = em.find(LearningPath.class, pathId);
        learningPath.setVisibility(v);
        em.persist(new ContentEditHistory(userRepository.getById(userId), learningPath, ContentEditType.visibility));
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

        em.createQuery("delete from ViewProgress vp where vp.content.contentId = :videoId")
                .setParameter("videoId", id)
                .executeUpdate();

        em.createQuery("delete from ContentNotification n where n.content.contentId = :contentId")
                .setParameter("contentId", id)
                .executeUpdate();

        em.createQuery("delete from ContentEditHistory h where h.content.contentId = :contentId")
                .setParameter("contentId", id)
                .executeUpdate();

        LearningPath learningPath = em.find(LearningPath.class, id);
        learningPath.setEntries(null);
        em.remove(learningPath);
    }
}
