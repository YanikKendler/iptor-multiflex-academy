package model;

import enums.VisibilityEnum;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Entity
public abstract class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contentId;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Tag> tags;

    @ManyToOne
    private User user;

    private String title;
    private String description;
    private String color;
    @Enumerated(EnumType.STRING)
    private VisibilityEnum visibility;
    private final LocalDateTime creationTime;

    public Content(String title, String description, VisibilityEnum visibility) {
        this();
        this.title = title;
        this.description = description;
        this.visibility = visibility;
    }

    public Content() {
        this.creationTime = LocalDateTime.now();
        this.tags = new LinkedList<>();
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getContentId() {
        return contentId;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void addTag(Tag tag) {
        tags.add(tag);
    }

    public void removeTag(Tag tag) {
        tags.remove(tag);
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

    public LocalDateTime getCreationTime() {
        return creationTime;
    }
}
