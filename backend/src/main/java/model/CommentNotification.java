package model;

import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.ManyToOne;
import org.hibernate.annotations.Cascade;

@Entity
@Inheritance
public class CommentNotification extends Notification{
    @ManyToOne
    private Comment comment;

    @ManyToOne
    private Video video;

    public CommentNotification() {
        super();
    }

    public CommentNotification(User forUser, User triggeredByUser, Comment comment, Video video) {
        super(forUser, triggeredByUser);
        this.comment = comment;
        this.video = video;
    }

    public Comment getComment() {
        return comment;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
    }
}
