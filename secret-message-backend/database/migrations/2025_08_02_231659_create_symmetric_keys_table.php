<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('symmetric_keys', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('receiver_id')->constrained('users')->cascadeOnDelete();

            $table->text('cypher');      // base-64 ciphertext of the AES key
            $table->text('signature');   // base-64 signature over `cypher`
            $table->string('algo', 50);  // e.g. AES-256-GCM

            $table->timestamps();        // created_at = when the key was shared
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('symmetric_keys');
    }
};
