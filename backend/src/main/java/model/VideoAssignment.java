package model;

import jakarta.persistence.*;
import jakarta.ws.rs.Consumes;
import org.apache.derby.client.am.DateTime;

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
    private LocalDateTime date;

    public VideoAssignment(Long assignmentId, User assignedTo, User assignedBy, Video video, LocalDateTime date) {
        this.assignmentId = assignmentId;
        this.assignedTo = assignedTo;
        this.assignedBy = assignedBy;
        this.video = video;
        this.date = date;
    }

    public VideoAssignment() {
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

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    //</editor-fold>
}
