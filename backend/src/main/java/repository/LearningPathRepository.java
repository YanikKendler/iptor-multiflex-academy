package repository;

import dtos.*;
import enums.ContentNotificationEnum;
import enums.VisibilityEnum;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import model.*;

import java.util.*;

@ApplicationScoped
@Transactional
public class LearningPathRepository {
    @Inject
    EntityManager em;

    public LearningPathDetailDTO getDetailDTO(Long pathId, Long userId){
        LearningPath learningPath = em.find(LearningPath.class, pathId);

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

                return new LearningPathEntryDTO(
                    entry.getPathEntryId(),
                    entry.getVideo().getContentId(),
                    entry.getVideo().getTitle(),
                    duration,
                    entry.getVideo().getComments(null).size(),
                    entry.getEntryPosition(),
                    learningPath.getUser().getUserId()
                );
            }
        ).toList());
    }

    public LearningPathDetailDTO update(EditLearningPathDTO data) {
        LearningPath pathToUpdate = em.find(LearningPath.class, data.contentId());

        pathToUpdate.setTitle(data.title());
        pathToUpdate.setDescription(data.description());
        pathToUpdate.setTags(data.tags());
        pathToUpdate.setVisibility(data.visibility());
        pathToUpdate.setColor(data.color());

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

        pathToUpdate.setEntries(entries);

        em.merge(pathToUpdate);

        alertRelevantUsers(pathToUpdate);

        return null;
    }

    public void alertRelevantUsers(LearningPath learningPath){
        List<User> savedUsers = em.createQuery("select distinct u from User u " +
                        "join u.savedContent us on us.contentId = :contentId", User.class)
                .setParameter("contentId", learningPath.getContentId())
                .getResultList();

        savedUsers.forEach(user -> {
            if(Objects.equals(learningPath.getUser().getUserId(), user.getUserId())){
                return;
            }
            em.persist(new ContentNotification(user, learningPath.getUser(), learningPath, ContentNotificationEnum.update));
        });
    }

    public LearningPath create(EditLearningPathDTO data, Long userId) {
        System.out.println(data.toString());

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
        em.persist(newLearningPath);

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

    public void updatePathVisibility(Long pathId, VisibilityEnum v) {
        LearningPath learningPath = em.find(LearningPath.class, pathId);
        learningPath.setVisibility(v);
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

        LearningPath learningPath = em.find(LearningPath.class, id);
        learningPath.setEntries(null);
        em.remove(learningPath);
    }
}
