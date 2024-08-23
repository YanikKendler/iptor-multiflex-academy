package model;

import enums.ContentNotificationEnum;
import jakarta.persistence.*;

@Entity
@Inheritance
public class ContentNotification extends Notification {
    @ManyToOne
    private Content content;

    @Enumerated(EnumType.STRING)
    ContentNotificationEnum type;

    public ContentNotification() {
        super();
    }

    public ContentNotification(User forUser, User triggeredByUser, Content content, ContentNotificationEnum type) {
        super(forUser, triggeredByUser);
        this.content = content;
        this.type = type;
    }

    public Content getContent() {
        return content;
    }

    public void setContent(Content content) {
        this.content = content;
    }

    public ContentNotificationEnum getType() {
        return type;
    }

    public void setType(ContentNotificationEnum type) {
        this.type = type;
    }

    // comments
    // request video
    // updated video for saved or assigned
    // video assignment
}
