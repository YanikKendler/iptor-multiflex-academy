package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.qute.i18n.Message;
import io.vertx.ext.web.Session;
import jakarta.persistence.*;

import java.net.Authenticator;
import java.net.PasswordAuthentication;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Properties;

@Entity
public abstract class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne
    private User forUser;

    @ManyToOne
    private User triggeredByUser;

    private boolean done;

    @Column
    private final LocalDateTime timestamp;

    public Notification() {
        this.timestamp = LocalDateTime.now();
        this.done = false;
    }

    public Notification(User forUser, User triggeredByUser) {
        this.timestamp = LocalDateTime.now();
        this.forUser = forUser;
        this.triggeredByUser = triggeredByUser;
        this.done = false;
    }

    @Override
    public String toString() {
        return triggeredByUser.getUsername();
    }

    //<editor-fold desc="Getter und Setter">
    public Long getNotificationId() {
        return notificationId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public User getForUser() {
        return forUser;
    }

    public void setForUser(User forUser) {
        this.forUser = forUser;
    }

    public User getTriggeredByUser() {
        return triggeredByUser;
    }

    public void setTriggeredByUser(User triggeredByUser) {
        this.triggeredByUser = triggeredByUser;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }


    //</editor-fold>
}
