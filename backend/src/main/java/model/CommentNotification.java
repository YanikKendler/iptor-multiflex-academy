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
    private Video content;

    public CommentNotification() {
        super();
    }

    public CommentNotification(User forUser, User triggeredByUser, Comment comment, Video content) {
        super(forUser, triggeredByUser);
        this.comment = comment;
        this.content = content;
    }

    @Override
    public String toString() {
        return super.toString() + " has posted a comment in " + content.getTitle() + " • " + comment.getText();
    }

    public Comment getComment() {
        return comment;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }

    public Video getContent() {
        return content;
    }

    public void setContent(Video content) {
        this.content = content;
    }
}
