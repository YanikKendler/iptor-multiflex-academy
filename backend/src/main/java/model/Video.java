package model;

import dtos.VideoDetailDTO;
import dtos.VideoOverviewDTO;
import enums.VisibilityEnum;
import jakarta.annotation.Nullable;
import jakarta.inject.Inject;
import jakarta.persistence.*;
import org.hibernate.annotations.Cascade;
import repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

@Entity
public class Video extends Content {
    @OneToMany(fetch = FetchType.EAGER)
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<Comment> comments = new LinkedList<>();

    @OneToMany(fetch = FetchType.EAGER)
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<Question> questions = new LinkedList<>();

    @OneToMany(fetch = FetchType.EAGER)
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<StarRating> starRatings = new LinkedList<>();

    @OneToOne
    @Nullable
    private VideoFile videoFile;

    public Video(String title, String description, VisibilityEnum visibility) {
        super(title, description, visibility);
    }

    public Video(String title, String description, VisibilityEnum visibility, String color, Set<Tag> tags, List<Question> questions, @Nullable VideoFile videoFile, User creator) {
        super(title, description, visibility);
        this.setTags(tags);
        this.setUser(creator);
        this.setColor(color);
        this.questions = questions;
        this.videoFile = videoFile;
    }

    public Video() { super(); }

    public VideoDetailDTO toVideoDetailDTO(){
        return new VideoDetailDTO(
                this.getContentId(),
                this.getTitle(),
                this.getDescription(),
                this.getColor(),
                this.getTags(),
                this.getComments(null),
                this.getQuestions(),
                this.calculateStarRating(),
                this.getVideoFile(),
                0,
                this.getVisibility(),
                this.getUser().getUserId()
        );
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

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public List<Comment> getComments(Long userId) {
        if(userId == null) {
            return comments;
        }

        comments.sort((c1, c2) -> {
            if (c1.getUser().getUserId().equals(userId) && !c2.getUser().getUserId().equals(userId)) {
                return -1;
            } else if (!c1.getUser().getUserId().equals(userId) && c2.getUser().getUserId().equals(userId)) {
                return 1;
            } else {
                return c2.getTimestamp().compareTo(c1.getTimestamp());
            }
        });
        return comments;
    }

    public List<Comment> getAllComments(){
        return comments;
    }

    public List<Question> getQuestions() {
        questions.sort(Question::compareTo);
        return questions;
    }

    public VideoFile getVideoFile() {
        return videoFile;
    }

    public void setVideoFile(VideoFile videoFileId) {
        this.videoFile = videoFileId;
    }
}
