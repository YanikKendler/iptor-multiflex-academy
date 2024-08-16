package boundary;

import dtos.CreateVideoDTO;
import dtos.EditVideoDTO;
import dtos.VideoDetailDTO;
import dtos.VideoOverviewDTO;
import enums.VisibilityEnum;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import model.Video;
import model.VideoFile;
import org.jboss.resteasy.reactive.RestResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repository.VideoRepository;

import java.io.File;
import java.io.InputStream;

@Path("video")
public class VideoResource {
    private static final Logger log = LoggerFactory.getLogger(VideoResource.class);
    @Inject
    VideoRepository repository;

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/videofile")
    public Response uploadVideoFile(@FormParam("file") InputStream uploadedInputStream, @QueryParam("filename") String filename) {
        try {
            VideoFile videoFile = repository.uploadVideo(uploadedInputStream, filename);

            return Response.ok().entity(videoFile).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(e).build();
        }
    }

    @DELETE
    @Path("/videofile/{fileId: [0-9]+}")
    public Response deleteVideoFile(@PathParam("fileId") Long fileId) {
        try {
            repository.deleteVideoFile(fileId);
            return Response.ok().entity("{\"message\":\"File deleted successfully\"}").build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(e).build();
        }
    }

    //alternative with easier to grab metadata and nicer code but extremely buggy - most likely incompatible dependencies
    /*@POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/upload")
    public Response upload(@FormDataParam("file") FormDataBodyPart file) {
        System.out.println("upload " + file.getName());

        try {
            repository.uploadVideo(file.getValueAs(InputStream.class));

            return Response.ok().entity("{\"message\":\"File uploaded successfully\"}").build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(e).build();
        }
    }*/

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createVideo(CreateVideoDTO v){
        try {
            Video video = repository.create(v);

            return Response.ok().build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }

    @GET
    @Path("{videoId: [0-9]+}")
    public Response getVideoDetails(@PathParam("videoId") Long videoId, @QueryParam("userId") Long userId){
        VideoDetailDTO videoDetailDTO;
        try{
            videoDetailDTO = repository.getVideoDetailsForUser(videoId, userId);
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(videoDetailDTO).build();
    }

    @GET
    @Path("{id: [0-9]+}")
    public Response getVideo(@PathParam("id") Long id){
        Video video;
        try{
            video = repository.getById(id);
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(video).build();
    }

    @GET
    @Produces(MediaType.MULTIPART_FORM_DATA)
    @Path("{videoId:[0-9]+}/getVideoFragment/{fileName}")
    public RestResponse<File> getVideoFragment(@PathParam("fileName") String fileName, @PathParam("videoId") Long videoId) {
        try {
            File file = repository.getVideoFragment(videoId, fileName);
            return RestResponse.ResponseBuilder.ok(file)
                    .header("Content-Disposition", "attachment; filename=\""+ fileName +"\"")
                    .build();
        }
        catch (NullPointerException e){
            //return RestResponse.ResponseBuilder.notFound().build();
            return null;
        }
        catch (Exception e){
            e.printStackTrace();
            //return RestResponse.ResponseBuilder.serverError().build();
            return null;
        }
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteVideo(@PathParam("id") Long id){
        try{
            repository.delete(id);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateVideo(EditVideoDTO video){
        try{
            System.out.println(video.toString());

            VideoDetailDTO videoDetailDTO = repository.update(video);

            return Response.ok(videoDetailDTO).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @PUT
    @Path("{videoId: [0-9]+}/visibility")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateVisibility(@PathParam("videoId") Long videoId, JsonObject v){
        try{
            System.out.println(v);
            repository.updateVideoVisibility(videoId, VisibilityEnum.valueOf(v.getString("visibility")));
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Path("{videoId: [0-9]+}/linkVideoFile/{fileId: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response linkVideoFile(@PathParam("videoId") Long videoId, @PathParam("fileId") Long fileId){
        try{
            repository.linkVideoFile(videoId, fileId);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
