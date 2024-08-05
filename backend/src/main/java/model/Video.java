package model;

import enums.VisibilityEnum;
import jakarta.persistence.*;

import java.util.LinkedList;
import java.util.List;

@Entity
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long videoId;

    @OneToMany(fetch = FetchType.EAGER)
    private List<Tag> tags;

    @OneToMany(fetch = FetchType.EAGER)
    private List<Comment> comments;

    @OneToMany(fetch = FetchType.EAGER)
    private List<Question> questions;

    @OneToMany(fetch = FetchType.EAGER)
    private List<StarRating> starRatings;

    private String title;
    private String description;
    private boolean save;
    private String color;
    private VisibilityEnum visibility;
    private boolean requestVideo;

    public Video(String title, String description, boolean save, String color, VisibilityEnum visibility, boolean requestVideo) {
        this.tags = new LinkedList<>();
        this.comments = new LinkedList<>();
        this.questions = new LinkedList<>();
        this.starRatings = new LinkedList<>();
        this.title = title;
        this.description = description;
        this.save = save;
        this.color = color;
        this.visibility = visibility;
        this.requestVideo = requestVideo;
    }

    public void addTag(Tag tag) {
        tags.add(tag);
    }

    public void addComment(Comment comment) {
        comments.add(comment);
    }

    public void addQuestion(Question question) {
        questions.add(question);
    }

    public void addStarRating(StarRating starRating) {
        starRatings.add(starRating);
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
