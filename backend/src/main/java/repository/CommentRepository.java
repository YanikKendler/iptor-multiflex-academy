package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Comment;
import model.User;
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
        //todo when users are implemented, get the user from the session
        comment.setUser(em.find(User.class, 1L));
        videoRepository.getById(videoId).addComment(comment);
        em.persist(comment);
    }

    @Transactional
    public void update(Comment comment) {
        comment.updateTimestamp();
        em.merge(comment);
    }

    @Transactional
    public void delete(Long id, Long videoId, Long userId) {
        Comment comment = getById(id);
        if (comment != null) {
            Video video = videoRepository.getById(videoId);
            if (video != null) {
                video.getComments(userId).remove(comment);
            }
            em.remove(comment);
        }
    }

    public List<Comment> getAll(Long videoId, Long userId) {
        // the comments are ordered by the user id, so that the user's comments are shown first
        return em.createQuery("select c from Video v join v.comments c where v.contentId = :videoId order by case when c.user.id = :userId then 0 else 1 end, c.timestamp desc", Comment.class)
                .setParameter("videoId", videoId)
                .setParameter("userId", userId)
                .getResultList();
    }

    public Comment getById(Long id){
        return em.find(Comment.class, id);
    }
}
