package model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class StarRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ratingId;

    @ManyToOne
    private
    User user;

    private int rating;

    private final LocalDateTime timestamp;

    public StarRating(User user, int rating) {
        this();
        this.user = user;
        this.rating = rating;
    }

    public StarRating() {
        this.timestamp = LocalDateTime.now();
    }

    public Long getRatingId() {
        return ratingId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
