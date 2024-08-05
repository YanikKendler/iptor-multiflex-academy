package model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.sql.Timestamp;

@Entity
public class ViewProgress {
    @Id
    @GeneratedValue
    private Long progressId;

    @ManyToOne
    private Video video;

    private Timestamp timestamp;
    private int progress;

    public ViewProgress(Video video, Timestamp timestamp, int progress) {
        this.video = video;
        this.timestamp = timestamp;
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

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }
}
