package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Comment;
import model.Tag;
import model.Video;

import java.util.List;

@ApplicationScoped
public class CommentRepository {
    @Inject
    EntityManager em;

    @Inject
    VideoRepository videoRepository;

    @Transactional
    public void create(Long videoId, Comment comment) {
        videoRepository.getById(videoId).addComment(comment);
        em.persist(comment);
    }

    @Transactional
    public void update(Comment comment) {}

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }

    public List<Comment> getAll(Long videoId) {
        return em.createQuery("select c from Video v join v.comments c where v.videoId = :videoId", Comment.class)
                .setParameter("videoId", videoId).getResultList();
    }

    public Comment getById(Long id){
        return em.find(Comment.class, id);
    }
}
