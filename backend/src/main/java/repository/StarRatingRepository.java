package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import model.Comment;
import model.StarRating;
import model.User;
import org.hibernate.sql.ast.tree.expression.Star;

import java.util.List;

@ApplicationScoped
public class StarRatingRepository {
    @Inject
    EntityManager em;

    @Inject
    VideoRepository videoRepository;

    @Transactional
    public void set(Long videoId, Long userId, double rating) {

    }

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }

    public List<StarRating> getAll(Long videoId) {
        return em.createQuery("select s from Video v join v.starRatings s where v.videoId = :videoId", StarRating.class)
                .setParameter("videoId", videoId).getResultList();
    }

    public StarRating getById(Long id){
        return em.find(StarRating.class, id);
    }

    public double getAverage(Long vid) {
        return em.createQuery("select avg(s.rating) from Video v join v.starRatings s where v.videoId = :vid", Double.class)
                .setParameter("vid", vid).getSingleResult();
    }

    public StarRating getRating(Long vid, Long uid) {
        try {
            return em.createQuery("select s from Video v join v.starRatings s where v.videoId = :vid and s.user.id = :uid", StarRating.class)
                    .setParameter("vid", vid)
                    .setParameter("uid", uid)
                    .getSingleResult();
        } catch (NoResultException e) {
            StarRating starRating = new StarRating();
            starRating.setUser(em.find(User.class, uid));
            return starRating;
        }
    }
}
