package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import enums.UserEnum;
import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.json.JsonObject;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    private User supervisor;

    @ManyToOne
    private User deputySupervisor;

    @Enumerated(EnumType.STRING)
    private UserEnum userType;

    @OneToMany
    @JsonIgnore
    private List<Content> savedContent;

    public User(String username, String email, String password, UserEnum userType) {
        this.username = username;
        this.email = email;
        setPassword(password);
        this.userType = userType;
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

    public boolean verifyPassword(String password) {
        return BcryptUtil.matches(password, this.password);
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

    public void setPassword(String password) {
        this.password = BcryptUtil.bcryptHash(password);
    }

    public String getPassword() {
        return password;
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

    public User getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(User supervisor) {
        this.supervisor = supervisor;
    }

    public User getDeputySupervisor() {
        return deputySupervisor;
    }

    public void setDeputySupervisor(User deputySupervisor) {
        this.deputySupervisor = deputySupervisor;
    }

    public UserEnum getUserType() {
        return userType;
    }

    public void setUserType(UserEnum userType) {
        this.userType = userType;
    }

    public void setSavedContent(List<Content> savedContent) {
        this.savedContent = savedContent;
    }

    //</editor-fold>
}
