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
        Video video = videoRepository.getById(videoId);

        video.addComment(comment);
        comment.setVideo(video);

        em.persist(comment);
    }

    @Transactional
    public void update(Comment comment) {}

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }

    public List<Comment> getAll(Long videoId) {
        return em.createQuery("select c from Comment c where c.video.id = :videoId", Comment.class)
                .setParameter("videoId", videoId).getResultList();
    }

    public Comment getById(Long id){
        return em.find(Comment.class, id);
    }
}
