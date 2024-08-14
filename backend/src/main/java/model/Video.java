package model;

import enums.VisibilityEnum;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Entity
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long videoId;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Tag> tags;

    @OneToMany(fetch = FetchType.EAGER)
    private List<Comment> comments;

    @OneToMany(fetch = FetchType.EAGER)
    private List<Question> questions;

    @OneToMany(fetch = FetchType.EAGER)
    private List<StarRating> starRatings;

    private String title;
    private String description;
    private String color;
    @Enumerated(EnumType.STRING)
    private VisibilityEnum visibility;
    @OneToOne
    @Nullable
    private VideoFile videoFile;

    private final LocalDateTime creationTime;

    public Video(String title, String description, String color, VisibilityEnum visibility) {
        this();
        this.tags = new LinkedList<>();
        this.comments = new LinkedList<>();
        this.questions = new LinkedList<>();
        this.starRatings = new LinkedList<>();
        this.title = title;
        this.description = description;
        this.color = color;
        this.visibility = visibility;
    }

    public Video() {
        this.creationTime = LocalDateTime.now();
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


    public double calculateStarRating() {
        double sum = 0;
        for (StarRating starRating : starRatings) {
            sum += starRating.getRating();
        }
        return sum / starRatings.size();
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

    public VideoFile getVideoFile() {
        return videoFile;
    }

    public void setVideoFile(VideoFile videoFileId) {
        this.videoFile = videoFileId;
    }

    public LocalDateTime getCreationTime() {
        return creationTime;
    }
}
