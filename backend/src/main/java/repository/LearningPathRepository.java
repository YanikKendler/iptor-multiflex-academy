package repository;

import dtos.LearningPathDetailDTO;
import dtos.LearningPathEntryDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.LearningPath;
import model.LearningPathEntry;
import model.User;
import model.ViewProgress;

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
                learningPath.getEntries().stream().map(entry -> new LearningPathEntryDTO(entry.getPathEntryId(), entry.getVideo().getContentId(), entry.getVideo().getTitle(), entry.getEntryPosition())).toList());
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
}
