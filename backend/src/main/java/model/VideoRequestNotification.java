package model;

import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;

@Entity
@Inheritance
public class VideoRequestNotification extends Notification{
    private String requestMessage;

    public VideoRequestNotification() {
        super();
    }

    public VideoRequestNotification(User forUser, User triggeredByUser, String requestMessage) {
        super(forUser, triggeredByUser);
        this.requestMessage = requestMessage;
    }

    public String getRequestMessage() {
        return requestMessage;
    }

    public void setRequestMessage(String requestMessage) {
        this.requestMessage = requestMessage;
    }
}
