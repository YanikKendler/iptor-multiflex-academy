package model;

import enums.ContentNotificationEnum;
import jakarta.inject.Inject;
import jakarta.persistence.*;
import repository.NotificationRepository;

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

    @Override
    public String toString() {
        if(type == ContentNotificationEnum.update) {
            return super.toString() + " has updated a relevant video/learningpath • " + content.getTitle();
        } else if(type == ContentNotificationEnum.finishedRequest) {
            return super.toString() + " has marked your video request as Completed • " + content.getTitle();
        } else if(type == ContentNotificationEnum.assignment) {
            return "New content assignment from " + super.toString() + " • " + content.getTitle();
        } else if(type == ContentNotificationEnum.approved) {
            return super.toString() + " has approved your video/learningpath • " + content.getTitle();
        } else if(type == ContentNotificationEnum.videoCreateRequest) {
            return super.toString() + " has requested a video";
        }
        return "";
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
