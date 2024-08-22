package model;

import enums.UserEnum;
import enums.VisibilityEnum;
import jakarta.persistence.*;
import org.hibernate.usertype.UserType;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

@Entity
public abstract class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contentId;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Tag> tags;

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
        this.tags = new HashSet<>();
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

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public Set<Tag> getTags() {
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

    public boolean isVisibleForUser(User user) {
        if(UserEnum.ADMIN == user.getUserType()) {
            return true;
        }

        if (visibility == VisibilityEnum.self) {
            return false;
        } else if (visibility == VisibilityEnum.everyone) {
            return true;
        } else if (visibility == VisibilityEnum.customers) {
            return user.getUserType() == UserEnum.CUSTOMER;
        } else if (visibility == VisibilityEnum.internal) {
            return user.getUserType() == UserEnum.EMPLOYEE;
        }
        return false;
    }
}
