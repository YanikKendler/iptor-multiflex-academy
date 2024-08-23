package model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class ContentAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignmentId;

    @ManyToOne
    private User assignedTo;

    @ManyToOne
    private User assignedBy;

    @ManyToOne
    private Content content;

    @Column
    private final LocalDateTime timestamp;

    public ContentAssignment(User assignedBy, User assignedTo, Content content) {
        this();
        this.assignedTo = assignedTo;
        this.assignedBy = assignedBy;
        this.content = content;
    }

    public ContentAssignment() {
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

    public Content getContent() {
        return content;
    }

    public void setContent(Video video) {
        this.content = video;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    //</editor-fold>
}
