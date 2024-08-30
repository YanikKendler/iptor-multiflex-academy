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

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Transactional
@ApplicationScoped
public class ContentRepository {
    @Inject
    EntityManager em;

    @Inject
    UserRepository userRepository;

    @Inject
    NotificationRepository notificationRepository;

    public ContentForUserDTO searchContent(String search, Long userId, List<Tag> tags) {
        try {
            List<Content> content = em.createQuery("SELECT distinct c FROM Content c " +
                            "left join c.tags t " +
                            "WHERE ((t is null and :areTagsEmpty = true) or not exists(" +
                            "    select t from Tag t " +
                            "    where t in :tags and t not in elements(c.tags)" +
                            ")) and (LOWER(c.title) LIKE LOWER(:search) or LOWER(c.description) LIKE LOWER(:search))", Content.class)
                    .setParameter("search", "%" + search + "%")
                    .setParameter("tags", tags)
                    .setParameter("areTagsEmpty", tags.isEmpty())
                    .getResultList();

            List<VideoOverviewDTO> videos = content.stream()
                    .filter(c -> c instanceof Video).map(c -> userRepository.convertVideoToOverviewDTO((Video) c, userId)).toList();
            List<LearningPathOverviewDTO> learningPaths = content.stream()
                    .filter(c -> c instanceof LearningPath).map(c -> userRepository.convertLearningPathToOverviewDTO(c, userId)).toList();

            return new ContentForUserDTO(new VideoAndLearningPathOverviewCollection(videos, learningPaths), null, null);
        } catch(NoResultException e) {
            return new ContentForUserDTO(null, null, null);
        }
    }

    public List<ContentOverviewDTO> getFullContent(Long userId) {
        List<Content> c =  em.createQuery("SELECT c FROM Content c where c.visibility != 'self' or c.user.userId = :userId or c.user.userRole = 'admin'", Content.class)
                .setParameter("userId", userId)
                .getResultList();

        return c.stream().map(content -> {
            if(content instanceof Video) {
                return new ContentOverviewDTO(content.getContentId(), content.getTitle(), "Video");
            } else {
                return new ContentOverviewDTO(content.getContentId(), content.getTitle(), "Learning Path");
            }
        }).toList();
    }

    public void approveContent(Long contentId, Long userId) {
        Content c = em.find(Content.class, contentId);
        c.setApproved(true);

        ContentNotification notification = new ContentNotification(c.getUser(), userRepository.getById(userId), c, ContentNotificationEnum.approved);
        em.persist(notification);
        notificationRepository.sendConfirmationEmail(notification);
    }

    public List<ContentEditHistoryDTO> getContentEditHistory(Long contentId) {
        List<ContentEditHistory> history = em.createQuery("SELECT h FROM ContentEditHistory h WHERE h.content.contentId = :contentId", ContentEditHistory.class)
                .setParameter("contentId", contentId).getResultList();

        return history.stream().map(h -> new ContentEditHistoryDTO(h.getUser(), h.getType(), h.getTimestamp())).toList();
    }
}
