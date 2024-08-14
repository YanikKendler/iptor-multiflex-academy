package model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class LearningPathEntry {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    Long pathEntryId;

    @ManyToOne
    private
    Video video;

    private boolean quizCompleted;

    private final LocalDateTime creationTime;

    public LearningPathEntry(Video video) {
        this();
        this.video = video;
    }

    public LearningPathEntry() {
        creationTime = LocalDateTime.now();
    }

    public Long getPathEntryId() {
        return pathEntryId;
    }

    public LocalDateTime getCreationTime() {
        return creationTime;
    }

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
    }

    public boolean isQuizCompleted() {
        return quizCompleted;
    }

    public void setQuizCompleted(boolean quizCompleted) {
        this.quizCompleted = quizCompleted;
    }
}
