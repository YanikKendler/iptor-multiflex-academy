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

    public ContentForUserDTO searchContent(String search, Long userId, List<Tag> tags) {
        try {
            List<Content> content = em.createQuery("SELECT distinct c FROM Content c " +
                            "join c.tags t " +
                            "WHERE not exists(" +
                            "    select t from Tag t " +
                            "    where t in :tags and t not in elements(c.tags)" +
                            ") and LOWER(c.title) LIKE LOWER (:search) or LOWER(c.description) LIKE LOWER(:search) " +
                            "and not exists(" +
                            "    select t from Tag t " +
                            "    where t in :tags and t not in elements(c.tags)" +
                            ")", Content.class)
                    .setParameter("search", "%" + search + "%").setParameter("tags", tags).getResultList();

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
