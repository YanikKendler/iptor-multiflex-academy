package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.checkerframework.common.aliasing.qual.Unique;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;

@Entity
public class ViewProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long progressId;

    @ManyToOne
    private Video video;

    @JsonIgnore
    @ManyToOne
    @Unique
    private User user;

    private int durationSeconds;

    private LocalDateTime timestamp;

    public ViewProgress(Video video, User user, int durationSeconds) {
        this.video = video;
        this.user = user;
        this.durationSeconds = durationSeconds;
        this.timestamp = LocalDateTime.now();
    }

    public ViewProgress() {
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Long getProgressId() {
        return progressId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
    }

    public int getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(int durationSeconds) {
        this.durationSeconds = durationSeconds;
    }
}
