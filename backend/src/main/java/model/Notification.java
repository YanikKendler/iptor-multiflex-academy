package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.sql.Timestamp;

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
    private Timestamp datetime;

    public Notification(Long notificationId, User user, String text, Timestamp datetime) {
        this.notificationId = notificationId;
        this.user = user;
        this.text = text;
        this.datetime = datetime;
    }

    public Notification() {
    }

    //<editor-fold desc="Getter und Setter">
    public Long getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
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

    public Timestamp getDatetime() {
        return datetime;
    }

    public void setDatetime(Timestamp datetime) {
        this.datetime = datetime;
    }
    //</editor-fold>
}
