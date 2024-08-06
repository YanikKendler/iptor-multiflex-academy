package model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class VideoAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignmentId;

    @ManyToOne
    private User assignedTo;

    @ManyToOne
    private User assignedBy;

    @ManyToOne
    private Video video;

    @Column
    private final LocalDateTime timestamp;

    public VideoAssignment(User assignedTo, User assignedBy, Video video) {
        this();
        this.assignedTo = assignedTo;
        this.assignedBy = assignedBy;
        this.video = video;
    }

    public VideoAssignment() {
        this.timestamp = LocalDateTime.now();
    }

    //<editor-fold desc="Getter und Setter">
    public Long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }

    public User getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(User assignedTo) {
        this.assignedTo = assignedTo;
    }

    public User getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(User assignedBy) {
        this.assignedBy = assignedBy;
    }

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    //</editor-fold>
}
