package model;

import enums.VideoRequestEnum;
import jakarta.persistence.*;

@Entity
public class VideoRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    private String title;
    private String text;

    @ManyToOne
    private Video video;

    @Enumerated(EnumType.STRING)
    private VideoRequestEnum status;

    @ManyToOne
    private User user;

    public VideoRequest() {
    }

    public VideoRequest(String title, String text, Video video, VideoRequestEnum status, User user) {
        this.title = title;
        this.text = text;
        this.video = video;
        this.status = status;
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public Long getRequestId() {
        return requestId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
    }

    public VideoRequestEnum getStatus() {
        return status;
    }

    public void setStatus(VideoRequestEnum status) {
        this.status = status;
    }
}
