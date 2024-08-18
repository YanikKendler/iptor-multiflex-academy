package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.LearningPath;

@ApplicationScoped
@Transactional
public class LearningPathRepository {
    @Inject
    EntityManager em;

    public LearningPath getById(Long pathId){
        return em.find(LearningPath.class, pathId);
    }
}
