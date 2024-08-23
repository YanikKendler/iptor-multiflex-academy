package model;

import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;

@Entity
@Inheritance
public class TextNotification extends Notification{
    private String text;

    public TextNotification() {
        super();
    }

    public TextNotification(User forUser, User triggeredByUser, String text) {
        super(forUser, triggeredByUser);
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
