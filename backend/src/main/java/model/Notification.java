package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne
    private User user;

    @Column
    private String text;

    @Column
    private final LocalDateTime timestamp;

    public Notification(User user, String text) {
        this();
        this.user = user;
        this.text = text;
    }

    public Notification() {
        this.timestamp = LocalDateTime.now();
    }

    //<editor-fold desc="Getter und Setter">
    public Long getNotificationId() {
        return notificationId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    //</editor-fold>
}
