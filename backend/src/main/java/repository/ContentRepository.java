package repository;

import dtos.*;
import enums.VisibilityEnum;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import model.*;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
@ApplicationScoped
public class ContentRepository {
    @Inject
    EntityManager em;

    @Inject
    UserRepository userRepository;

    public ContentForUserDTO searchContent(String search, Long userId) {
        try {
            List<Content> content = em.createQuery("SELECT c FROM Content c " +
                            "WHERE LOWER(c.title) LIKE LOWER(:search) " +
                            "OR LOWER(c.description) LIKE LOWER(:search)", Content.class)
                    .setParameter("search", "%" + search + "%").getResultList();

            List<VideoOverviewDTO> videos = content.stream()
                    .filter(c -> c instanceof Video).map(c -> userRepository.convertVideoToOverviewDTO((Video) c, userId)).toList();
            List<LearningPathOverviewDTO> learningPaths = content.stream()
                    .filter(c -> c instanceof LearningPath).map(c -> userRepository.convertLearningPathToOverviewDTO(c, userId)).toList();

            return new ContentForUserDTO(new VideoAndLearningPathOverviewCollection(videos, learningPaths), null, null);
        } catch(NoResultException e) {
            return new ContentForUserDTO(null, null, null);
        }
    }
}
