package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.checkerframework.common.aliasing.qual.Unique;

import java.time.LocalDateTime;

@Entity
public class ViewProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long progressId;

    @JsonIgnore
    @ManyToOne
    private Content content;

    @JsonIgnore
    @ManyToOne
    @Unique
    private User user;

    /** Duration of the video in seconds or progress for learning paths */
    private int progress;
    private boolean ignored;
    private LocalDateTime timestamp;


    public ViewProgress(Content content, User user, int progress) {
        this.content = content;
        this.user = user;
        this.progress = progress;
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

    public Content getContent() {
        return content;
    }

    public void setContent(Content content) {
        this.content = content;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int durationSeconds) {
        this.progress = durationSeconds;
    }

    public boolean isIgnored() {
        return ignored;
    }

    public void setIgnored(boolean ignored) {
        this.ignored = ignored;
    }
}
