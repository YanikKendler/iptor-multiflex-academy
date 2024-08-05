package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Comment;
import model.StarRating;
import org.hibernate.sql.ast.tree.expression.Star;

import java.util.List;

@ApplicationScoped
public class StarRatingRepository {
    @Inject
    EntityManager em;

    @Inject
    VideoRepository videoRepository;

    @Transactional
    public void create(Long videoId, StarRating starRating) {
        videoRepository.getById(videoId).addStarRating(starRating);
        em.persist(starRating);
    }

    @Transactional
    public void update(StarRating starRating) {}

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
}
