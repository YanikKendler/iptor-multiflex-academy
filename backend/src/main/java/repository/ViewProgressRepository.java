package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import model.User;
import model.Video;
import model.ViewProgress;

import java.util.List;

@Transactional
@ApplicationScoped
public class ViewProgressRepository {
    @Inject
    EntityManager em;

    @Inject
    VideoRepository videoRepository;

    public void update(Long userId, Long videoId, int durationSeconds) {
        ViewProgress viewProgress = null;

        try{
            viewProgress = em.createQuery(
                            "select vp from ViewProgress vp " +
                                    "where vp.user.userId = :userId " +
                                    "and vp.video.videoId = :videoId"
                            , ViewProgress.class)
                    .setParameter("userId", userId)
                    .setParameter("videoId", videoId)
                    .setMaxResults(1)
                    .getSingleResult();
        }catch (NoResultException ignored){ }

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

    /*public List<ViewProgress> getAll() {
        return em.createQuery("select p from ViewProgress p", ViewProgress.class).getResultList();
    }*/

    /*public ViewProgress getById(Long id){
        return em.find(ViewProgress.class, id);
    }*/

    public ViewProgress getLatest(Long videoId, Long userId) {
        try {
            return em.createQuery("select p from ViewProgress p where p.video.id = :vid and p.user.id = :uid", ViewProgress.class)
                    .setParameter("vid", videoId)
                    .setParameter("uid", userId)
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}
