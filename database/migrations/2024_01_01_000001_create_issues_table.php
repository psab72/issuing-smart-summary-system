<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->enum('category', ['bug', 'feature', 'infrastructure', 'security', 'performance', 'other'])->default('other');
            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])->default('open');
            $table->string('reporter_name')->nullable();
            $table->string('reporter_email')->nullable();
            $table->text('ai_summary')->nullable();
            $table->text('suggested_action')->nullable();
            $table->boolean('escalated')->default(false);
            $table->string('escalation_reason')->nullable();
            $table->timestamp('due_at')->nullable();
            $table->timestamps();

            // Indexes for filtered list queries
            $table->index('status');
            $table->index('priority');
            $table->index('category');
            $table->index('escalated');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('issues');
    }
};
