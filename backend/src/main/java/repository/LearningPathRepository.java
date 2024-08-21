package repository;

import dtos.LearningPathDetailDTO;
import dtos.LearningPathEntryDTO;
import enums.VisibilityEnum;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.*;

@ApplicationScoped
@Transactional
public class LearningPathRepository {
    @Inject
    EntityManager em;

    public LearningPathDetailDTO getById(Long pathId, Long userId){
        LearningPath learningPath = em.find(LearningPath.class, pathId);

        ViewProgress viewProgress;

        try{
            viewProgress = em.createQuery("select vp from ViewProgress vp where vp.content.contentId = :contentId and vp.user.userId = :userId", ViewProgress.class)
                    .setParameter("contentId", pathId).setParameter("userId", userId).setMaxResults(1).getSingleResult();
        } catch (Exception e) {
            viewProgress = null;
        }

        return new LearningPathDetailDTO(learningPath.getContentId(), learningPath.getTitle(), learningPath.getDescription(),
                learningPath.getTags(), viewProgress, learningPath.getVisibility(), learningPath.getColor(),
                learningPath.getEntries().stream().map(entry -> {
                    Long duration = 0L;
                    try{
                            duration = entry.getVideo().getVideoFile().getDurationSeconds();
                    }catch (NullPointerException ignored){ }

                    return new LearningPathEntryDTO(entry.getPathEntryId(), entry.getVideo().getContentId(), entry.getVideo().getTitle(), duration, entry.getVideo().getComments(null).size(), entry.getEntryPosition());
                }).toList());
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
}
