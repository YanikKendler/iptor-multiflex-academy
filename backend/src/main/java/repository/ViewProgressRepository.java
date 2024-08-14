package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Tag;
import model.User;
import model.Video;
import model.ViewProgress;

import java.sql.Timestamp;
import java.util.List;

@Transactional
@ApplicationScoped
public class ViewProgressRepository {
    @Inject
    EntityManager em;

    @Inject
    VideoRepository videoRepository;

    public void update(Long userId, Long videoId, int durationSeconds) {
        ViewProgress viewProgress = em.createQuery(
                        "select vp from ViewProgress vp " +
                                "where vp.user.userId = :userId " +
                                "and vp.video.videoId = :videoId"
                        , ViewProgress.class)
                .setParameter("userId", userId)
                .setParameter("videoId", videoId)
                .setMaxResults(1)
                .getSingleResult();

        if(viewProgress == null) {
            viewProgress = new ViewProgress(
                    em.find(Video.class, videoId),
                    em.find(User.class, userId),
                    durationSeconds);

            em.persist(viewProgress);
        }
        else{
            viewProgress.setDurationSeconds(durationSeconds);
        }
    }

    public void delete(Long videoId, Long userId) {
        ViewProgress vp = getLatest(videoId, userId);
        if(vp != null) {
            em.remove(vp);
        }
    }

    public List<ViewProgress> getAll() {
        return em.createQuery("select p from ViewProgress p", ViewProgress.class).getResultList();
    }

    public ViewProgress getById(Long id){
        return em.find(ViewProgress.class, id);
    }

    public ViewProgress getLatest(Long vid, Long uid) {
        try {
            return em.createQuery("select p from ViewProgress p where p.video.id = :vid and p.user.id = :uid", ViewProgress.class)
                    .setParameter("vid", vid)
                    .setParameter("uid", uid)
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}
