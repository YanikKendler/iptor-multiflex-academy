package model;

import enums.VisibilityEnum;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long videoId;

    @OneToMany(fetch = FetchType.EAGER)
    private List<Tag> tags;

    @OneToMany(mappedBy = "video", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<Comment> comments;

    @OneToMany(mappedBy = "video", fetch = FetchType.EAGER)
    private List<Question> questions;

    private String title;
    private String description;
    private boolean save;
    private String color;
    private VisibilityEnum visibility;
    private boolean requestVideo;

    public Video(List<Tag> tags, List<Comment> comments, List<Question> questions, String title, String description, boolean save, String color, VisibilityEnum visibility, boolean requestVideo) {
        this.tags = tags;
        this.comments = comments;
        this.questions = questions;
        this.title = title;
        this.description = description;
        this.save = save;
        this.color = color;
        this.visibility = visibility;
        this.requestVideo = requestVideo;
    }

    public Video() {
    }

    public Long getVideoId() {
        return videoId;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isSave() {
        return save;
    }

    public void setSave(boolean save) {
        this.save = save;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public VisibilityEnum getVisibility() {
        return visibility;
    }

    public void setVisibility(VisibilityEnum visibility) {
        this.visibility = visibility;
    }

    public boolean isRequestVideo() {
        return requestVideo;
    }

    public void setRequestVideo(boolean requestVideo) {
        this.requestVideo = requestVideo;
    }
}
