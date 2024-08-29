package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import model.Content;
import model.User;
import model.Video;
import model.ViewProgress;

@Transactional
@ApplicationScoped
public class ViewProgressRepository {
    @Inject
    EntityManager em;

    public ViewProgress update(Long videoId, Long userId, int durationSeconds) {
        ViewProgress viewProgress = null;

        try {
            viewProgress = em.createQuery(
                            "select vp from ViewProgress vp " +
                                    "where vp.user.userId = :userId " +
                                    "and vp.content.contentId = :videoId"
                            , ViewProgress.class)
                    .setParameter("userId", userId)
                    .setParameter("videoId", videoId)
                    .setMaxResults(1)
                    .getSingleResult();
            viewProgress.setProgress(durationSeconds);
            viewProgress.setIgnored(false);
        } catch (NoResultException ignored) {
            Content content = em.find(Content.class, videoId);
            User user = em.find(User.class, userId);
            if (content != null && user != null) {
                viewProgress = new ViewProgress(content, user, durationSeconds);
                em.persist(viewProgress);
            } else {
                throw new IllegalArgumentException("Video or User not found");
            }
        }

        return viewProgress;
    }


    public void ignore(Long videoId, Long userId) {
        ViewProgress vp = getLatest(videoId, userId);
        if (vp != null) {
            vp.setIgnored(true);
        }
    }

    public void delete(Long videoId, Long userId) {
        ViewProgress vp = getLatest(videoId, userId);
        if (vp != null) {
            em.remove(vp);
        }
    }

    public ViewProgress getLatest(Long videoId, Long userId) {
        try {
            return em.createQuery("select p from ViewProgress p where p.content.id = :vid and p.user.id = :uid", ViewProgress.class)
                    .setParameter("vid", videoId)
                    .setParameter("uid", userId)
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}