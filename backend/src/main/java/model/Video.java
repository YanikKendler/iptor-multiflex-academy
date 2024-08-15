package model;

import enums.VisibilityEnum;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Entity
public class Video extends Content {
    @OneToMany(fetch = FetchType.EAGER)
    private List<Comment> comments = new LinkedList<>();

    @OneToMany(fetch = FetchType.EAGER)
    private List<Question> questions = new LinkedList<>();

    @OneToMany(fetch = FetchType.EAGER)
    private List<StarRating> starRatings = new LinkedList<>();

    @OneToOne
    @Nullable
    private VideoFile videoFile;

    public Video(String title, String description, VisibilityEnum visibility) {
        super(title, description, visibility);
    }

    public Video() { super(); }

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

    public List<Question> getQuestions() {
        return questions;
    }

    public VideoFile getVideoFile() {
        return videoFile;
    }

    public void setVideoFile(VideoFile videoFileId) {
        this.videoFile = videoFileId;
    }
}
