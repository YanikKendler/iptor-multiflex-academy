package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;
    @ManyToOne
    private User user;
    @Column(length = 2000)
    private String text;
    private LocalDateTime timestamp;

    @OneToMany
    @JsonIgnore
    private List<Video> videos;

    public Comment(User user, String text) {
        this();
        this.user = user;
        this.text = text;
    }

    public Comment() {
        timestamp = LocalDateTime.now();
    }

    public void updateTimestamp() {
        timestamp = LocalDateTime.now();
    }

    public Long getCommentId() {
        return commentId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Video> getVideos() {
        return videos;
    }

    public void setVideos(List<Video> videos) {
        this.videos = videos;
    }
}
