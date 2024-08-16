package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.json.JsonObject;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "app_user")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "user_type")
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @OneToMany
    @JsonIgnore
    private List<Content> savedContent;

    public User(String username, String email) {
        this.username = username;
        this.email = email;
    }

    public User() { }

    public JsonObject calculateStatistics(){
        /* TODO just for fun and out of interest - stuff like:
         * how many total comments to user left
         * how many videos rated
         * average star rating given
         * how many quizes completed
         * how many videos watched
         * how many videos saved
         * how many videos uploaded
         * how many learningpaths completed
         */
        return null;
    }

    public void toggleSavedContent(Content content) {
        if (savedContent.contains(content)) {
            savedContent.remove(content);
        } else {
            savedContent.add(content);
        }
    }

    //<editor-fold desc="Getter und Setter">
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Content> getSavedContent() {
        return savedContent;
    }

    public void setSavedVideos(List<Content> saved) {
        this.savedContent = saved;
    }
    //</editor-fold>
}
