package model;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.Duration;

@Entity
public class ViewProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long progressId;

    @ManyToOne
    private Video video;

    private int durationSeconds;
    private int progress;

    public ViewProgress(Video video, int durationSeconds, int progress) {
        this.video = video;
        this.durationSeconds = durationSeconds;
        this.progress = progress;
    }

    public ViewProgress() {
    }

    public Long getProgressId() {
        return progressId;
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

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }
}
