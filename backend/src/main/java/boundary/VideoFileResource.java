package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.VideoFile;
import org.jboss.resteasy.reactive.RestResponse;
import repository.VideoFileRepository;

import java.io.File;
import java.io.InputStream;

@Path("/")
public class VideoFileResource {
    @Inject
    VideoFileRepository repository;

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("video/videofile")
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
    @Path("video/videofile/{fileId: [0-9]+}")
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
}
