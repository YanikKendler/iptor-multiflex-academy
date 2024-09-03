package model;

import enums.ContentEditType;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class ContentEditHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int videoEditHistoryId;

    @Nullable
    @ManyToOne
    private User user;

    @ManyToOne
    private Content content;

    @Enumerated(EnumType.STRING)
    private ContentEditType type;

    private LocalDateTime timestamp;

    public ContentEditHistory() {
    }

    public ContentEditHistory(User user, Content content, ContentEditType type) {
        this.user = user;
        this.content = content;
        this.type = type;
        this.timestamp = LocalDateTime.now();
    }

    public Content getContent() {
        return content;
    }

    public void setContent(Content content) {
        this.content = content;
    }

    public int getVideoEditHistoryId() {
        return videoEditHistoryId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ContentEditType getType() {
        return type;
    }

    public void setType(ContentEditType type) {
        this.type = type;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
