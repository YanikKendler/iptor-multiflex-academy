package repository;

import enums.ContentNotificationEnum;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Comment;
import model.CommentNotification;
import model.User;
import model.Video;

import java.util.List;

@ApplicationScoped
public class CommentRepository {
    @Inject
    EntityManager em;

    @Inject
    VideoRepository videoRepository;

    @Inject
    NotificationRepository notificationRepository;

    @Transactional
    public void create(Long userId, Long videoId, Comment comment) {
        comment.setUser(em.find(User.class, userId));
        Video video = videoRepository.getById(videoId);
        video.addComment(comment);
        em.persist(comment);

        if(!comment.getUser().getUserId().equals(video.getUser().getUserId())){
            CommentNotification notification = new CommentNotification(video.getUser(), comment.getUser(), comment, video);
            em.persist(notification);
            notificationRepository.sendConfirmationEmail(notification);
        }
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
            em.createQuery("delete from CommentNotification n where n.comment.commentId = :commentId")
                    .setParameter("commentId", id)
                    .executeUpdate();

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
