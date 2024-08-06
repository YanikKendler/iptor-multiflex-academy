package dtos;

import model.Tag;

import java.util.List;

public record VideoOverviewDTO(Long videoId, String title, String description, List<Tag> tags, boolean saved, String color) {
}
