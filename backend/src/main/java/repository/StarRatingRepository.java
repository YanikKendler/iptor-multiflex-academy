package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import model.Comment;
import model.StarRating;
import model.User;
import model.Video;
import org.hibernate.sql.ast.tree.expression.Star;

import java.util.List;

@ApplicationScoped
public class StarRatingRepository {
    @Inject
    EntityManager em;

    @Inject
    VideoRepository videoRepository;

    @Transactional
    public void set(Long videoId, Long userId, int rating) {
        StarRating starRating;
        try{
            starRating = em.createQuery("select s from Video v join v.starRatings s where v.contentId = :videoId and s.user.id = :userId", StarRating.class)
                    .setParameter("videoId", videoId)
                    .setParameter("userId", userId)
                    .getSingleResult();
            starRating.setRating(rating);
        } catch (NoResultException e) {
            starRating = new StarRating();
            starRating.setRating(rating);
            starRating.setUser(em.find(User.class, userId));

            Video video = videoRepository.getById(videoId);
            video.addStarRating(starRating);
            em.persist(starRating);
            return;
        }

        em.merge(starRating);
    }

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }

    public List<StarRating> getAll(Long videoId) {
        return em.createQuery("select s from Video v join v.starRatings s where v.contentId = :contentId", StarRating.class)
                .setParameter("contentId", videoId).getResultList();
    }

    public StarRating getById(Long id){
        return em.find(StarRating.class, id);
    }

    public double getAverage(Long vid) {
        return em.createQuery("select avg(s.rating) from Video v join v.starRatings s where v.contentId = :vid", Double.class)
                .setParameter("vid", vid).getSingleResult();
    }

    public int getStarRating(Long videoId, Long userId) {
        try{
            return em.createQuery("select s.rating from Video v join v.starRatings s where v.contentId = :contentId and s.user.id = :userId", Integer.class)
                    .setParameter("contentId", videoId)
                    .setParameter("userId", userId)
                    .getSingleResult();
        } catch(NoResultException e) {
            return 0;
        }

    }
}
